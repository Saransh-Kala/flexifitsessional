-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  user_type TEXT CHECK (user_type IN ('user', 'gym_owner', 'admin')) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gyms table
CREATE TABLE public.gyms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone TEXT,
  email TEXT,
  price_per_session DECIMAL(10, 2) NOT NULL,
  facilities TEXT[], -- Array of facilities like 'Cardio', 'Weight Training', etc.
  images TEXT[], -- Array of image URLs
  opening_hours JSONB, -- Store opening hours as JSON
  is_active BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gym_sessions table for available time slots
CREATE TABLE public.gym_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  capacity INTEGER DEFAULT 1,
  booked_count INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.gym_sessions(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  session_time TIME NOT NULL,
  status TEXT CHECK (status IN ('confirmed', 'cancelled', 'completed')) DEFAULT 'confirmed',
  total_amount DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  gym_id UUID NOT NULL REFERENCES public.gyms(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table for gym owner-user communication
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  category TEXT,
  tags TEXT[],
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for gyms
CREATE POLICY "Anyone can view approved gyms" ON public.gyms FOR SELECT USING (is_approved = true OR auth.uid() = owner_id);
CREATE POLICY "Gym owners can create gyms" ON public.gyms FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Gym owners can update their own gyms" ON public.gyms FOR UPDATE USING (auth.uid() = owner_id);

-- RLS Policies for gym_sessions
CREATE POLICY "Anyone can view gym sessions" ON public.gym_sessions FOR SELECT USING (true);
CREATE POLICY "Gym owners can manage their gym sessions" ON public.gym_sessions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.gyms WHERE gyms.id = gym_sessions.gym_id AND gyms.owner_id = auth.uid())
);

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Gym owners can view bookings for their gyms" ON public.bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.gyms WHERE gyms.id = bookings.gym_id AND gyms.owner_id = auth.uid())
);
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for reviews
CREATE POLICY "Anyone can view approved reviews" ON public.reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can create reviews for their bookings" ON public.reviews FOR INSERT WITH CHECK (
  auth.uid() = user_id AND 
  EXISTS (SELECT 1 FROM public.bookings WHERE bookings.id = reviews.booking_id AND bookings.user_id = auth.uid())
);

-- RLS Policies for messages
CREATE POLICY "Users can view their own messages" ON public.messages FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = receiver_id
);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- RLS Policies for blog_posts
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Authors can manage their own blog posts" ON public.blog_posts FOR ALL USING (auth.uid() = author_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_gyms_updated_at BEFORE UPDATE ON public.gyms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_gym_sessions_updated_at BEFORE UPDATE ON public.gym_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update gym rating
CREATE OR REPLACE FUNCTION public.update_gym_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.gyms 
  SET 
    rating = (SELECT AVG(rating::DECIMAL) FROM public.reviews WHERE gym_id = NEW.gym_id AND is_approved = true),
    total_reviews = (SELECT COUNT(*) FROM public.reviews WHERE gym_id = NEW.gym_id AND is_approved = true)
  WHERE id = NEW.gym_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for rating updates
CREATE TRIGGER update_gym_rating_trigger AFTER INSERT OR UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_gym_rating();
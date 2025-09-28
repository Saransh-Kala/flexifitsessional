-- Update gym images with real photos
UPDATE gyms SET images = ARRAY['/images/fitzone-premium.jpg'] WHERE name = 'FitZone Premium';
UPDATE gyms SET images = ARRAY['/images/powerhouse-gym.jpg'] WHERE name = 'PowerHouse Gym';
UPDATE gyms SET images = ARRAY['/images/yoga-bliss-studio.jpg'] WHERE name = 'Yoga Bliss Studio';
UPDATE gyms SET images = ARRAY['/images/crossfit-beast-mode.jpg'] WHERE name = 'CrossFit Beast Mode';
UPDATE gyms SET images = ARRAY['/images/aqua-fitness-center.jpg'] WHERE name = 'Aqua Fitness Center';
UPDATE gyms SET images = ARRAY['/images/24-7-fitness-hub.jpg'] WHERE name = '24/7 Fitness Hub';
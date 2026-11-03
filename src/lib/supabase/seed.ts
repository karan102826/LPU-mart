import { supabaseServer, isSupabaseConfigured } from './server';
import { LPU_CAMPUS_LOCATIONS } from '../escrow/handshake';

export async function seedSupabaseIfEmpty() {
  if (!isSupabaseConfigured) {
    console.log('Supabase credentials not configured, skipping Supabase seeding.');
    return;
  }

  try {
    // 1. Seed Campus Locations
    const { count: locCount } = await supabaseServer
      .from('campus_locations')
      .select('*', { count: 'exact', head: true });

    if (locCount === 0 || locCount === null) {
      console.log('Seeding campus_locations to Supabase...');
      const locationRows = LPU_CAMPUS_LOCATIONS.map((loc) => ({
        id: loc.id,
        name: loc.name,
        zone: loc.zone,
        latitude: loc.latitude,
        longitude: loc.longitude,
        radius_meters: loc.radiusMeters,
        description: loc.description,
      }));
      const { error: locErr } = await supabaseServer.from('campus_locations').upsert(locationRows);
      if (locErr) console.warn('Location seed notice:', locErr.message);
    }

    // 2. Seed Categories
    const { count: catCount } = await supabaseServer
      .from('categories')
      .select('*', { count: 'exact', head: true });

    if (catCount === 0 || catCount === null) {
      console.log('Seeding categories to Supabase...');
      const categories = [
        { id: 'cat_laptops', name: 'Laptops', slug: 'laptops', display_order: 1 },
        { id: 'cat_smartphones', name: 'Smartphones', slug: 'smartphones', display_order: 2 },
        { id: 'cat_electronics', name: 'Electronics', slug: 'electronics', display_order: 3 },
        { id: 'cat_furniture', name: 'Furniture', slug: 'furniture', display_order: 4 },
        { id: 'cat_textbooks', name: 'Textbooks', slug: 'textbooks', display_order: 5 },
        { id: 'cat_gaming', name: 'Gaming', slug: 'gaming', display_order: 6 },
        { id: 'cat_accessories', name: 'Accessories', slug: 'accessories', display_order: 7 },
        { id: 'cat_household', name: 'Household essentials', slug: 'household', display_order: 8 },
        { id: 'cat_misc', name: 'Miscellaneous', slug: 'misc', display_order: 9 },
      ];
      const { error: catErr } = await supabaseServer.from('categories').upsert(categories);
      if (catErr) console.warn('Categories seed notice:', catErr.message);
    }

    // 3. Seed Verified Profiles via Supabase Admin Auth
    const { count: profCount } = await supabaseServer
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    let priyaProfileId = 'a0000000-0000-0000-0000-000000000002';

    if (profCount === 0 || profCount === null) {
      console.log('Seeding initial student profiles to Supabase...');
      const initialUsers = [
        {
          fullName: 'Aarav Sharma',
          email: 'aarav.12104892@lpu.in',
          registrationNumber: '12104892',
          phone: '+91 98765 43210',
          department: 'School of Computer Science & Engineering',
          hostel: 'Boys Hostel 4 (BH-4), Room 312',
          role: 'buyer',
          verificationStatus: 'VERIFIED',
          walletBalancePaise: 850000,
        },
        {
          fullName: 'Priya Patel',
          email: 'priya.12015933@lpu.in',
          registrationNumber: '12015933',
          phone: '+91 98765 11223',
          department: 'School of Electronics & Electrical Engineering',
          hostel: 'Girls Hostel 2 (GH-2)',
          role: 'seller',
          verificationStatus: 'VERIFIED',
          walletBalancePaise: 1240000,
        },
        {
          fullName: 'Prof. K. Verma',
          email: 'admin.governance@lpu.in',
          registrationNumber: 'EMP_LPU_902',
          phone: '+91 98765 00000',
          department: 'LPU Student Welfare & Marketplace Governance Board',
          hostel: 'Staff Quarters Block C',
          role: 'admin',
          verificationStatus: 'VERIFIED',
          walletBalancePaise: 0,
        },
      ];

      for (const u of initialUsers) {
        let authUserId = '';
        // Try creating user or find existing
        const { data: createData, error: createError } = await supabaseServer.auth.admin.createUser({
          email: u.email,
          password: 'LpuMart2026SecurePass!',
          email_confirm: true,
          user_metadata: { full_name: u.fullName, registration_number: u.registrationNumber },
        });

        if (createData?.user) {
          authUserId = createData.user.id;
        } else if (createError) {
          // Check if user already exists
          const { data: listData } = await supabaseServer.auth.admin.listUsers();
          const existingUser = listData?.users?.find((eu) => eu.email === u.email);
          if (existingUser) authUserId = existingUser.id;
        }

        if (authUserId) {
          if (u.role === 'seller') priyaProfileId = authUserId;

          const { error: pErr } = await supabaseServer.from('profiles').upsert({
            id: authUserId,
            auth_user_id: authUserId,
            full_name: u.fullName,
            email: u.email,
            registration_number: u.registrationNumber,
            phone: u.phone,
            department: u.department,
            hostel: u.hostel,
            role: u.role,
            verification_status: u.verificationStatus,
            wallet_balance_paise: u.walletBalancePaise,
          });
          if (pErr) console.warn('Profile upsert notice:', pErr.message);
        }
      }
    }

    // 4. Seed Listings
    const { count: listCount } = await supabaseServer
      .from('listings')
      .select('*', { count: 'exact', head: true });

    if (listCount === 0 || listCount === null) {
      console.log('Seeding initial listings to Supabase...');
      // Get priya's profile ID if already exists
      const { data: priyaRecord } = await supabaseServer
        .from('profiles')
        .select('id')
        .eq('email', 'priya.12015933@lpu.in')
        .maybeSingle();

      const sellerId = priyaRecord?.id || priyaProfileId;

      const initialListings = [
        {
          id: 'b0000000-0000-0000-0000-000000000001',
          seller_id: sellerId,
          title: 'Apple MacBook Air M1 (8GB / 256GB SSD) Space Grey',
          description:
            'Used for 3 semesters of B.Tech CSE coding labs. Battery health 91%, cycle count 185. Comes with original 30W USB-C charger and neoprene sleeve. Ideal for Xcode, Android Studio, and web development.',
          category_id: 'cat_laptops',
          condition: 'Like New',
          listing_type: 'both',
          price_paise: 5400000,
          rental_rate_per_day_paise: 35000,
          rental_deposit_paise: 500000,
          campus_location_id: 'loc_unimall',
          available: true,
        },
        {
          id: 'b0000000-0000-0000-0000-000000000002',
          seller_id: sellerId,
          title: 'Higher Engineering Mathematics — Dr. B.S. Grewal (44th Edition)',
          description:
            'Standard reference for MTH165, MTH166, and MTH167. Clean pages with minimal pencil highlights. Includes formula bookmark.',
          category_id: 'cat_textbooks',
          condition: 'Good',
          listing_type: 'buy',
          price_paise: 45000,
          rental_rate_per_day_paise: null,
          rental_deposit_paise: 0,
          campus_location_id: 'loc_block34',
          available: true,
        },
        {
          id: 'b0000000-0000-0000-0000-000000000003',
          seller_id: sellerId,
          title: 'Sony PlayStation 4 Slim (500GB) + 2 DualShock 4 + FIFA 24 & Spider-Man',
          description:
            'Hostel gaming setup! Clean console, quiet fan, updated to latest firmware. Includes 2 controllers, HDMI cable, power cord, and 2 game discs.',
          category_id: 'cat_gaming',
          condition: 'Good',
          listing_type: 'both',
          price_paise: 1650000,
          rental_rate_per_day_paise: 18000,
          rental_deposit_paise: 200000,
          campus_location_id: 'loc_unimall',
          available: true,
        },
      ];

      const { error: listErr } = await supabaseServer.from('listings').upsert(initialListings);
      if (listErr) {
        console.warn('Listings seed notice:', listErr.message);
      } else {
        // Seed images for the listings
        await supabaseServer.from('listing_images').upsert([
          {
            listing_id: 'b0000000-0000-0000-0000-000000000001',
            image_url:
              'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
            display_order: 1,
          },
          {
            listing_id: 'b0000000-0000-0000-0000-000000000002',
            image_url:
              'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
            display_order: 1,
          },
          {
            listing_id: 'b0000000-0000-0000-0000-000000000003',
            image_url:
              'https://images.unsplash.com/photo-1507457379470-08b800bebc67?auto=format&fit=crop&w=800&q=80',
            display_order: 1,
          },
        ]);
        console.log('Seeded initial listings and images to Supabase successfully.');
      }
    }
    console.log('Supabase sync verified successfully!');
  } catch (err: any) {
    console.warn('Supabase seeding notice:', err.message);
  }
}

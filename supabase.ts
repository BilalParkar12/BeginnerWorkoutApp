import { createClient } from '@supabase/supabase-js'
import 'expo-sqlite/localStorage/install'
import 'react-native-url-polyfill/auto'

const supabaseUrl = import.meta.env.EXPO_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.EXPO_PUBLIC_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

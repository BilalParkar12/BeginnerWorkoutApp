import { createClient } from '@supabase/supabase-js'
import 'expo-sqlite/localStorage/install'
import 'react-native-url-polyfill/auto'

const supabaseUrl = "https://cblyvhgfjhmxexhsxnfw.supabase.co";
const supabasePublishableKey = "sb_publishable_WRdDLEPTao0iJaWZEkZX8Q_cHC3hgQn";
export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

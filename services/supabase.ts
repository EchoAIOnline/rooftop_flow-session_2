
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fhjteieypcxbzaqirfci.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoanRlaWV5cGN4YnphcWlyZmNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU0Njg5NCwiZXhwIjoyMDg3MTIyODk0fQ.s5WVk7I0C7iUSA-XzHhuUXlwf6u8CPdDefJwPbwG42E';

export const supabase = createClient(supabaseUrl, supabaseKey);

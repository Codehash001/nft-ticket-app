import { supabase } from "./supabase-client";

const getActivePhaseId = async () => {
  // Fetch the last phase details
  const { data, error } = await supabase
    .from('settings')
    .select('phase_id, start_time, end_time')
    .order('end_time', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching last phase details:', error);
    return null;
  }

  console.log('Fetched data:', data);

  if (!data) {
    console.log('No phase data found');
    return null;
  }

  // Get current date
  const currentDate = new Date();
  const startDate = new Date(data.start_time);
  const endDate = new Date(data.end_time);

  console.log('Current date:', currentDate);
  console.log('Phase start date:', startDate);
  console.log('Phase end date:', endDate);

  // Check if current date is between start and end date
  if (currentDate >= startDate && currentDate < endDate) {
    console.log('Active phase ID:', data.phase_id);
    return data.phase_id;
  } else {
    console.log('Current date is not within the last phase period');
    return null;
  }
};

export default getActivePhaseId;
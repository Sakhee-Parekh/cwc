import ProvidersExperience from "./components/ProvidersExperience";
import { getProvidersData } from "./lib/getProvidersData";

export default async function Page() {
  const { data, syncedAtISO } = await getProvidersData();
  return <ProvidersExperience data={data} syncedAtISO={syncedAtISO} />;
}

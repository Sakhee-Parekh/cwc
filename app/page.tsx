import ProvidersExperience from "./components/ProvidersExperience";
import { getProvidersData } from "./lib/getProvidersData";

export default async function Page() {
  const { data, syncedLabel } = await getProvidersData();
  return <ProvidersExperience data={data} syncedLabel={syncedLabel} />;
}

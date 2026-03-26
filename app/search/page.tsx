import { getProvidersData } from "../lib/getProvidersData";
import ProvidersSearchPageClient from "../components/ProvidersSearchPageClient";

export const dynamic = "force-dynamic";

export default async function SearchPage(props: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { data, syncedAtISO } = await getProvidersData();

  const sp = (await props.searchParams) ?? {};

  const rawWhat = sp.what;
  const rawWhere = sp.where;

  const what = Array.isArray(rawWhat) ? rawWhat[0] : (rawWhat ?? "");
  const where = Array.isArray(rawWhere) ? rawWhere[0] : (rawWhere ?? "");

  return (
    <ProvidersSearchPageClient
      key={`${what}__${where}`}
      data={data}
      syncedAtISO={syncedAtISO}
      whatParam={what}
      whereParam={where}
    />
  );
}

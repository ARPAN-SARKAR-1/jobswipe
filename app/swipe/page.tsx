import { SwipeDeck } from "@/components/swipe/SwipeDeck";
import { getSwipeJobs } from "@/lib/data";
import { requireUser } from "@/lib/session";

export default async function SwipePage() {
  const user = await requireUser(["STUDENT"]);
  const data = await getSwipeJobs(user.id);

  return <SwipeDeck initialJobs={data.jobs} initialViewed={data.viewedCount} totalJobs={data.totalJobs} />;
}

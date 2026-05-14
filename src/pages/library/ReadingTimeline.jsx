import { useRef } from "react";
import ReadingTimelineComponent from "../../features/library/bookshelf/components/ReadingTimeline";
import Board from "../../features/profile/components/Board";
import GoBackBtn from "../../components/GoBackButton";
import ScrollToRef from "../../components/ScrollToRef";

const ReadingTimeline = () => {
  const boardRef = useRef(null);

  return (
    <Board
      title="Reading Timeline"
      ref={boardRef}
      titleRight={
        <GoBackBtn defaultDest="/library/cenhan" text="Back to Library" />
      }
    >
      <ReadingTimelineComponent />
      <ScrollToRef scrollRef={boardRef} />
    </Board>
  );
};
export default ReadingTimeline;

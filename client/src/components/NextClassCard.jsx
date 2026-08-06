import { FaStepForward } from "react-icons/fa";
import ClassInfoCard from "./ClassInfoCard";

const NextClassCard = ({ nextClass }) => {
  return (
    <ClassInfoCard
      title={<span className="flex items-center gap-2"><FaStepForward /> Next Class</span>}
      status="UP NEXT"
      gradient="emerald"
      item={nextClass}
    />
  );
};

export default NextClassCard;
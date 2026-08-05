import ClassInfoCard from "./ClassInfoCard";

const NextClassCard = ({ nextClass }) => {
  return (
    <ClassInfoCard
      title="⏭️ Next Class"
      status="UP NEXT"
      gradient="emerald"
      item={nextClass}
    />
  );
};

export default NextClassCard;
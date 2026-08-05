import ClassInfoCard from "./ClassInfoCard";

const CurrentClassCard = ({ currentClass }) => {
  return (
    <ClassInfoCard
      title="📍 Current Class"
      status="LIVE NOW"
      gradient="indigo"
      item={currentClass}
    />
  );
};

export default CurrentClassCard;
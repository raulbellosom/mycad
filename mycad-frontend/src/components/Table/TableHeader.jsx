import ActionButtons from '../ActionButtons/ActionButtons';

const TableHeader = ({ title, actions }) => {
  return (
    <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between text-start bg-white gap-4">
      <h1 className="text-xl font-bold text-orange-500 w-full">{title}</h1>
      <div className="w-full flex gap-2 justify-start md:justify-end">
        <ActionButtons extraActions={actions} />
      </div>
    </div>
  );
};

export default TableHeader;

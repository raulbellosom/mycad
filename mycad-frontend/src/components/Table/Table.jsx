import { Checkbox, Table as T } from 'flowbite-react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import classNames from 'classnames';

const Table = ({ columns, children, sortBy, sortedBy, selectAll }) => {
  return (
    <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <T striped hoverable>
          <T.Head className="text-nowrap">
            {columns?.map((col) => (
              <T.HeadCell
                key={col?.id}
                scope="col"
                className={`${col?.order || col?.id === 'checkbox' ? '' : 'pointer-events-none'} p-4 bg-mycad-gray-dark text-white ${col?.id !== 'checkbox' ? 'cursor-pointer hover:bg-orange-500 hover:text-white transition-colors ease-in-out duration-100' : ''} ${col?.id === sortedBy && 'bg-orange-500'} ${col?.classes}`}
                onClick={col?.id !== 'checkbox' ? () => sortBy(col.id) : null}
              >
                <span
                  className={classNames(
                    'flex flew-row gap-2 items-center',
                    col?.id === 'checkbox' || col?.id === 'actions'
                      ? 'justify-center'
                      : 'justify-start',
                  )}
                >
                  {col.value}
                  {col?.order && col?.id === sortedBy && (
                    <div className="cursor-pointer disabled">
                      {col.order === 'desc' ? <FaArrowDown /> : <FaArrowUp />}
                    </div>
                  )}
                  {col?.id === 'checkbox' && (
                    <Checkbox
                      className="cursor-pointer text-orange-500 focus:ring-orange-500"
                      onChange={selectAll}
                    />
                  )}
                </span>
              </T.HeadCell>
            ))}
          </T.Head>
          <T.Body>{children}</T.Body>
        </T>
      </div>
    </div>
  );
};

export default Table;

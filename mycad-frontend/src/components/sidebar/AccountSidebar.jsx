import React from 'react';
import classNames from 'classnames';
import MyCAD_ICON from '../../assets/logo/mycad_icon.webp';
import ImageViewer from '../ImageViewer/ImageViewer';

const AccountSidebar = ({ name, role, photo, collapsed, broken }) => {
  const logoClasses = classNames(
    'w-auto',
    'min-w-10',
    'h-10',
    'flex',
    'items-center',
    'justify-center',
    'rounded-full',
    'text-white',
    'text-2xl',
    'font-bold',
  );
  return (
    <div className="p-4 h-fit space-y-5">
      <div
        className={`w-full overflow-hidden whitespace-nowrap text-nowrap flex justify-start gap-4 items-center`}
      >
        <img src={MyCAD_ICON} alt="MyCAD ICON" className={logoClasses} />
        <span
          className={`text-2xl text-orange-500 font-extrabold mb-2 truncate`}
        >
          MyCAD
        </span>
      </div>
      {broken && (
        <div
          className={classNames(
            'w-full whitespace-nowrap overflow-hidden flex justify-start gap-4 items-center',
          )}
        >
          <div className="flex justify-center items-center h-10 w-10 min-w-10 min-h-10 overflow-hidden rounded-full bg-stone-400">
            <ImageViewer
              images={photo ? [photo] : ['https://via.placeholder.com/150']}
              imageStyles={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
          <div className={'truncate whitespace-nowrap text-nowrap'}>
            <h2
              className={classNames(
                'text-sm font-bold text-orange-500 w-full truncate',
              )}
            >
              {name}
            </h2>
            <p className={classNames('text-white w-full truncate text-xs')}>
              {role}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSidebar;

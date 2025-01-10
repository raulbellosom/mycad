import classNames from 'classnames';

export const getButtonClassNames = (
  color,
  filled,
  disabled = false,
  className,
) => {
  const baseClasses =
    'w-full md:w-fit h-9 xl:h-10 text-sm xl:text-base transition ease-in-out duration-200 p-2 xl:p-4 flex items-center justify-center rounded-md border text-stone-800';

  let notFilledClasses = {
    'hover:bg-orange-500 hover:text-white': color === 'mycad' && !disabled,
    'hover:bg-mycad-danger hover:text-white': color === 'danger' && !disabled,
    'hover:bg-mycad-warning hover:text-white': color === 'warning' && !disabled,
    'hover:bg-mycad-success hover:text-white': color === 'success' && !disabled,
    'hover:bg-mycad-info hover:text-white': color === 'info' && !disabled,
    'hover:bg-mycad-dark hover:text-white': color === 'dark' && !disabled,
    'hover:bg-red-500 hover:text-white': color === 'red' && !disabled,
    'hover:bg-yellow-300 hover:text-white': color === 'yellow' && !disabled,
    'hover:bg-cyan-500 hover:text-white': color === 'cyan' && !disabled,
    'hover:bg-indigo-500 hover:text-white': color === 'indigo' && !disabled,
    'hover:bg-green-500 hover:text-white': color === 'green' && !disabled,
    'hover:bg-blue-500 hover:text-white': color === 'blue' && !disabled,
    'hover:bg-purple-500 hover:text-white': color === 'purple' && !disabled,
    'hover:bg-amber-500 hover:text-white': color === 'amber' && !disabled,
    'hover:bg-gray-500 hover:text-white': color === 'gray' && !disabled,
    'hover:bg-stone-200 hover:text-stone-800': color === 'stone' && !disabled,
    'hover:bg-orange-400 hover:text-white': color === 'orange' && !disabled,
    'hover:bg-pink-500 hover:text-white': color === 'pink' && !disabled,
    'hover:bg-teal-500 hover:text-white': color === 'teal' && !disabled,
    'hover:bg-lime-500 hover:text-white': color === 'lime' && !disabled,
    'hover:bg-emerald-500 hover:text-white': color === 'emerald' && !disabled,
    'hover:bg-violet-500 hover:text-white': color === 'violet' && !disabled,
    'hover:bg-cyan-500 hover:text-white': color === 'cyan' && !disabled,
    'hover:bg-rose-500 hover:text-white': color === 'rose' && !disabled,
    'hover:bg-fuchsia-500 hover:text-white': color === 'fuchsia' && !disabled,
    'hover:bg-white text-black': color === 'white' && !disabled,
    'hover:bg-black hover:text-white': color === 'black' && !disabled,
    'hover:bg-sky-500 hover:text-white': color === 'sky' && !disabled,
    'hover:bg-neutral-200 hover:text-white': color === 'neutral' && !disabled,
  };
  let filledClasses = {
    'bg-orange-500 text-white border-mycad hover:bg-orange-600':
      color === 'mycad',
    'bg-mycad-danger text-white border-mycad-danger hover:bg-mycad-rose':
      color === 'danger',
    'bg-mycad-warning text-white border-mycad-warning hover:bg-mycad-salmon':
      color === 'warning',
    'bg-mycad-success text-white border-mycad-success hover:bg-mycad-success':
      color === 'success',
    'bg-mycad-info text-white border-mycad-info hover:bg-mycad-info':
      color === 'info',
    'bg-mycad-dark text-white border-mycad-dark hover:bg-mycad-dark':
      color === 'dark',
    'bg-red-500 text-white border-red-500 hover:bg-red-700': color === 'red',
    'bg-yellow-300 text-white border-yellow-300 hover:bg-yellow-400':
      color === 'yellow',
    'bg-cyan-500 text-white border-cyan-500 hover:bg-cyan-700':
      color === 'cyan',
    'bg-indigo-500 text-white border-indigo-500 hover:bg-indigo-700':
      color === 'indigo',
    'bg-green-500 text-white border-green-500 hover:bg-green-700':
      color === 'green',
    'bg-blue-500 text-white border-blue-500 hover:bg-blue-700':
      color === 'blue',
    'bg-purple-500 text-white border-purple-500 hover:bg-purple-700':
      color === 'purple',
    'bg-amber-500 text-white border-amber-500 hover:bg-amber-700':
      color === 'amber',
    'bg-gray-500 text-white border-gray-500 hover:bg-gray-700':
      color === 'gray',
    'bg-stone-200 text-stone-800 border-stone-200 hover:bg-stone-300':
      color === 'stone',
    'bg-orange-400 text-white border-orange-400 hover:bg-orange-700':
      color === 'orange',
    'bg-pink-500 text-white border-pink-500 hover:bg-pink-700':
      color === 'pink',
    'bg-teal-500 text-white border-teal-500 hover:bg-teal-700':
      color === 'teal',
    'bg-lime-500 text-white border-lime-500 hover:bg-lime-700':
      color === 'lime',
    'bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-700':
      color === 'emerald',
    'bg-violet-500 text-white border-violet-500 hover:bg-violet-700':
      color === 'violet',
    'bg-cyan-500 text-white border-cyan-500 hover:bg-cyan-700':
      color === 'cyan',
    'bg-rose-500 text-white border-rose-500 hover:bg-rose-700':
      color === 'rose',
    'bg-fuchsia-500 text-white border-fuchsia-500 hover:bg-fuchsia-700':
      color === 'fuchsia',
    'bg-white text-black border-white hover:bg-white': color === 'white',
    'bg-black text-white border-black hover:border-gray-200 hover:text-black hover:bg-stone-200':
      color === 'black',
    'bg-sky-500 text-white border-sky-500 hover:bg-sky-700': color === 'sky',
    'bg-neutral-100 text-white border-neutral-500 hover:bg-neutral-200':
      color === 'neutral',
  };

  const disabledClasses = {
    'cursor-not-allowed hover:bg-white hover:text-stone-800 hover:animate-shake':
      disabled,
  };

  const colorClasses = classNames(filled ? filledClasses : notFilledClasses);

  return classNames(baseClasses, colorClasses, disabledClasses, className);
};

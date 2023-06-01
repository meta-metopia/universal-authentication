import { classNames } from "./classnames";

interface Props {
  tabs: {
    name: string;
    current: boolean;
  }[];
  onSelect: (index: number) => void;
}

export default function Tabs({ tabs, onSelect }: Props) {
  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          defaultValue={tabs.find((tab) => tab.current)?.name}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <nav className="flex space-x-4" aria-label="Tabs">
          {tabs.map((tab, index) => (
            <button
              key={tab.name}
              className={classNames(
                tab.current
                  ? "bg-sky-200 text-sky-800"
                  : "text-gray-600 hover:text-gray-800",
                "rounded-md px-3 py-2 text-sm font-medium"
              )}
              aria-current={tab.current ? "page" : undefined}
              onClick={() => {
                onSelect(index);
              }}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

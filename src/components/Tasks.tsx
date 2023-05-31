import {
  CheckIcon,
  HandThumbUpIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { classNames } from "./classnames";
import { ContainedLoadingButton } from "./LoadingButtons";

export interface Props {
  timeline: {
    content: string;
    type: "progress" | "error";
    time: string;
    subContent?: string;
  }[];
  clearTimeline: () => void;
}

export default function Tasks({ timeline, clearTimeline }: Props) {
  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {timeline.map((event, eventIdx) => (
          <li key={eventIdx}>
            <div className="relative pb-8">
              {eventIdx !== timeline.length - 1 ? (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={classNames(
                      event.type === "progress"
                        ? "bg-green-500"
                        : "bg-yellow-200",
                      "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                    )}
                  >
                    {event.type === "progress" ? (
                      <InformationCircleIcon className="h-5 w-5 text-white" />
                    ) : (
                      <ExclamationCircleIcon className="h-5 w-5 text-white" />
                    )}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-black">{event.content} </p>
                    <p className="text-red-600 text-sm font-light">
                      {event.subContent}
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <time dateTime={event.time}>{event.time}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
        <div className="mb-10">
          <ContainedLoadingButton onClick={clearTimeline}>
            Clear timeline
          </ContainedLoadingButton>
        </div>
      </ul>
    </div>
  );
}

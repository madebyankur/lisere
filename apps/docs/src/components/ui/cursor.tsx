import { cn } from '@/lib/utils';

export const Cursor = ({ className }: { className?: string }) => {
  return (
    <svg
      width="49"
      height="48"
      viewBox="0 0 49 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        'slide-in-from-left-[150%] animate-in translate-y-1/6 ease-in-out-circ delay-50 text-primary absolute -right-10 bottom-0 z-30 scale-150 duration-500',
        className,
      )}
    >
      <g filter="url(#filter0_dd_184_3)">
        <path
          d="M29.5152 26.2859L22.0175 7.25313C21.7033 6.45563 22.4724 5.65834 23.2807 5.94361L42.9485 12.8852C43.7929 13.1832 43.85 14.3557 43.0386 14.7344L34.9952 18.4879C34.7725 18.5919 34.5958 18.7742 34.499 19.0002L31.3648 26.3133C31.0128 27.1345 29.8427 27.1171 29.5152 26.2859Z"
          fill="black"
          style={{ fill: 'black', fillOpacity: 1 }}
        />
        <path
          d="M29.5152 26.2859L22.0175 7.25313C21.7033 6.45563 22.4724 5.65834 23.2807 5.94361L42.9485 12.8852C43.7929 13.1832 43.85 14.3557 43.0386 14.7344L34.9952 18.4879C34.7725 18.5919 34.5958 18.7742 34.499 19.0002L31.3648 26.3133C31.0128 27.1345 29.8427 27.1171 29.5152 26.2859Z"
          stroke="white"
          style={{ stroke: 'white', strokeOpacity: 1 }}
          strokeWidth="2"
        />
      </g>
      <defs>
        <filter
          id="filter0_dd_184_3"
          x="0.943262"
          y="0.882355"
          width="47.6725"
          height="47.037"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="-8" dy="8" />
          <feGaussianBlur stdDeviation="6" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_184_3"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="-2" dy="2" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_184_3"
            result="effect2_dropShadow_184_3"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_184_3"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

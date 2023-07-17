import React from 'react';
import { ToastOptions, toast } from 'react-toastify';
import Image from 'next/image';

interface CustomToastProps {
  title: string;
  message: string;
  linkUrl: string;
  linkLabel: string;
  warning: boolean;
  error: boolean;
}

const CustomToast: React.FC<CustomToastProps> = ({
  title = '',
  message = '',
  linkUrl = '',
  linkLabel = '',
  warning = false,
  error = false
}) => (
  <div className="flex">
    <div className="mr-[6px]">
      <Image
        src={`/images/components/common/toast/icon-${warning ? 'warning' : error ? 'error' : 'success'}.svg`}
        alt=""
        width={48}
        height={48}
      />
    </div>
    <div className="flex flex-col justify-center">
      {title ? <div className="mb-[4px] text-[14px] font-semibold text-white">{title}</div> : null}
      {message ? <div className="mb-[4px] text-[12px] font-normal text-white">{message}</div> : null}
      <div className="flex items-center">
        {linkLabel && linkUrl ? (
          <a href={linkUrl} target="_blank" rel="noreferrer" className="flex flex-1 text-[12px] font-medium text-primaryBlue no-underline">
            {linkLabel} <Image src="/images/common/out.svg" className="ml-1" alt="" width={16} height={16} />
          </a>
        ) : null}
        {error ? <div className="closeButton">Close</div> : null}
      </div>
    </div>
  </div>
);

interface ToastProps {
  title?: string;
  message?: string;
  linkUrl?: string;
  linkLabel?: string;
  warning?: boolean;
  error?: boolean;
}

/**
 * Show a custom toast globally.
 * ToastContainer is placed in _app.js
 * @param {*} param0
 * @param {*} options
 */
export const showToast = (
  { title = '', message = '', linkUrl = '', linkLabel = '', warning = false, error = false }: ToastProps,
  options: ToastOptions<{}> = {}
) => {
  toast(<CustomToast title={title} message={message} linkUrl={linkUrl} linkLabel={linkLabel} warning={warning} error={error} />, {
    containerId: 'GLOBAL',
    ...options
  });
};

export const showOutlineToast = (
  { title = '', message = '', linkUrl = '', linkLabel = '', warning = false, error = false }: ToastProps,
  options: ToastOptions<{}> = {}
) => {
  toast(<CustomToast title={title} message={message} linkUrl={linkUrl} linkLabel={linkLabel} warning={warning} error={error} />, {
    containerId: 'GLOBAL_OUTLINE',
    ...options
  });
};

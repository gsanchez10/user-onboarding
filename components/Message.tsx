import classNames from 'classnames';

export enum ResultType {
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
};

const Message = ({ message, type }: { message: string, type: ResultType }) => {
  if (!message) return null;
  return <p className={classNames("mt-2 text-sm", { "text-red-600 dark:text-red-500": type === ResultType.ERROR, "text-green-600 dark:text-green-500": type === ResultType.SUCCESS })}>{message}</p>
}

export default Message;
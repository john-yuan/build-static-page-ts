export default interface Log {
  type: 'log' | 'info' | 'warning' | 'error';
  message: string;
}

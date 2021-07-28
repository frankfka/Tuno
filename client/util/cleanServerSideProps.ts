// See: https://github.com/vercel/next.js/issues/11993
export default function cleanServerSideProps<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

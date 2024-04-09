import { sleep } from './sleep'

export async function *ticker(
  from: number,
  to: number,
  step: number,
  delay: number,
) {
  for (let i = from; i <= to; i += step) {
    // eslint-disable-next-line no-await-in-loop
    await sleep(delay)
    yield i
  }
}

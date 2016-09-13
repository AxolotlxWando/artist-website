import { FNV } from 'fnv'

const fnv = new FNV()

export function hash (data) {
  fnv.update(Buffer(data))
  fnv.digest('hex')
  return (fnv.value() + 2147483647).toString(16)
}

const MyFNV = {hash}
export default MyFNV

import { Vec3,Node } from "cc"

//炮弹
export type Bullet={
    node:Node,
    velocity:Vec3
}

//渠道
type TChannel =
  | 'AppLovin'
  | 'Facebook'
  | 'Google'
  | 'IronSource'
  | 'Liftoff'
  | 'Mintegral'
  | 'Moloco'
  | 'Pangle'
  | 'Rubeex'
  | 'Tiktok'
  | 'Unity'
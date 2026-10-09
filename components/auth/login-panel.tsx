import { SunIcon } from "@/components/shared/icons";

export default function LoginPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-[linear-gradient(155deg,#F6A98E_0%,#F2937A_45%,#EC7E62_100%)] text-white lg:flex lg:flex-col lg:justify-between lg:p-[56px_60px]">
      <div className="absolute -right-[120px] -top-[140px] h-[420px] w-[420px] rounded-full bg-white/12" />
      <div className="absolute -bottom-[110px] -left-[80px] h-[300px] w-[300px] rounded-full bg-white/10" />

      <div className="relative flex items-center gap-[13px]">
        <div className="flex h-[46px] w-[46px] items-center justify-center rounded-[14px] bg-white/22">
          <SunIcon className="h-[26px] w-[26px]" strokeWidth={2.2} />
        </div>
        <span className="font-heading text-[21px] font-semibold tracking-[.5px]">
          OpenDayCare
        </span>
      </div>

      <div className="relative">
        <h1 className="m-0 mb-[18px] font-heading text-[42px] font-semibold leading-[1.12]">
          El día de cada niño,
          <br />
          compartido con su familia.
        </h1>
        <p className="m-0 max-w-[430px] text-[17px] leading-[1.6] text-white/92">
          Publica momentos, gestiona las salas y mantén a las familias cerca,
          desde un solo lugar.
        </p>
      </div>

      <div className="relative text-[14px] text-white/90">
        🌿 Guardería Sala Soles
      </div>
    </div>
  );
}

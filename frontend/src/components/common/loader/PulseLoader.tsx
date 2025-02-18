import style from './PulseLoader.module.css';

const PulseLoader = () => (
  <div className={style.pulseLoader}>
    <div className={style.pulse} />
    <div className={style.pulse} />
    <div className={style.pulse} />
  </div>
);

export default PulseLoader;

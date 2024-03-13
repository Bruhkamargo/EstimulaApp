import { useState, useEffect, useRef } from 'react';

import './App.css';
import './Modal.css'

import Play from '../../assets/Play.png';
import Pause from '../../assets/Pause.png';
import Stop from '../../assets/Stop.png';
import Config from '../../assets/Config.png';

function HomePage() {
  const ButtonColors = ['#ff0000', '#0000ff', '#8a2be2', '#00ff7f']; // Cores do numeros
  const [ListNumbers, setListNumbers] = useState([12, 55, 17, 9, 4, 20, 22, 2, 19, 11, 27, 5, 15, 30, 6, 23, 18, 24, 7, 28, 29, 1, 14, 10, 26, 13, 8, 21, 16, 3]); //Array de numeros padrão

  // Variaveis dos Cronometros
  const [Cronometro01, setCronometro01] = useState([0, 0]); // Minutos, Segundos
  const [IsC01Running, setIsC01Running] = useState(false);
  const [Cronometro02, setCronometro02] = useState([0, 0]); // Minutos, Segundos
  const [IsC02Running, setIsC02Running] = useState(false);

  // Variaveis de Avaliação
  const [Acertos, setAcertos] = useState(0);
  const [Erros, setErros] = useState(0);
  const [TempoTotal, setTempoTotal] = useState([0, 0]);
  const [TemposProcura, setTemposProcura] = useState([]);
  const [MedProcura, setMedProcura] = useState([]);

  // Variaveis de Controle
  const [CtrlConfig, setCtrlConfig] = useState(['', false, false])
  const [SeeModalConfig, setSeeModalConfig] = useState(false);
  const [SeeModalEnd, setSeeModalEnd] = useState(false);

  const PlayButton = useRef(null);
  const PauseButton = useRef(null);
  const StopButton = useRef(null);
  const CheckButtons01 = useRef(null);
  const CheckButtons02 = useRef(null);

  /**Primeiro Cronometro */
  useEffect(() => {
    let interval;

    if (IsC01Running) {
      interval = setInterval(() => {
        // Atualiza os segundos
        setCronometro01(prevCronometro => {
          let newSeconds = prevCronometro[1] + 1;
          let newMinutes = prevCronometro[0];

          // Verifica se os segundos ultrapassaram 59
          if (newSeconds === 60) {
            newSeconds = 0;
            newMinutes++;
          }

          return [newMinutes, newSeconds];
        });
      }, 1000);
    }

    // Limpa o intervalo quando o componente é desmontado ou quando o cronômetro é pausado
    return () => clearInterval(interval);
  }, [IsC01Running]);

  /**Segundo Cronometro */
  useEffect(() => {
    let interval;

    if (IsC02Running) {
      interval = setInterval(() => {
        // Atualiza os segundos
        setCronometro02(prevCronometro => {
          let newSeconds = prevCronometro[1] + 1;
          let newMinutes = prevCronometro[0];

          // Verifica se os segundos ultrapassaram 59
          if (newSeconds === 60) {
            newSeconds = 0;
            newMinutes++;
          }

          return [newMinutes, newSeconds];
        });
      }, 1000);
    }

    // Limpa o intervalo quando o componente é desmontado ou quando o cronômetro é pausado
    return () => clearInterval(interval);
  }, [IsC02Running]);

  /**Inicia o App com os botões de acerto e erro desabilitados */
  useEffect(() => {
    PlayButton.current.disabled = false;
    PauseButton.current.disabled = true;
    StopButton.current.disabled = true;
    CheckButtons01.current.disabled = true;
    CheckButtons02.current.disabled = true;
  }, [])

  /**Função para calcular a média dos tempos*/
  const calcularMedia = (tempos) => {
    // Soma dos tempos de cada parcial
    const somaTotal = tempos.reduce((total, parcial) => {
      return total + parcial[0] * 60 + parcial[1]; // Converte os minutos para segundos e adiciona aos segundos
    }, 0);

    // Média total dividida pelo número de parciais
    const media = somaTotal / tempos.length;

    // Converte a média para minutos e segundos
    const minutos = Math.floor(media / 60);
    const segundos = Math.floor(media % 60);

    setMedProcura([minutos, segundos]);
  };

  /**Botão Play: inicia os cronometros e habilita os botões */
  const handleStart = () => {
    console.log('Atividade Inciada');
    setIsC01Running(true);
    setIsC02Running(true);
    PlayButton.current.disabled = true;
    PauseButton.current.disabled = false;
    StopButton.current.disabled = false;
    CheckButtons01.current.disabled = false;
    CheckButtons02.current.disabled = false;
  };

  const handlePause = () => {
    console.log('Atividade Pausada');
    setIsC01Running(false);
    setIsC02Running(false);
    PlayButton.current.disabled = false;
  };

  /**Botão Stop: */
  const handleReset = () => {
    console.log('Atividade Parada');
    setTempoTotal(Cronometro01); // Salva o tempo total
    calcularMedia(TemposProcura);
    setIsC01Running(false);
    setIsC02Running(false);
    setCronometro01([0, 0]);
    setCronometro02([0, 0]);
  };

  const handleAcerto = () => {
    console.log('Acertou');
    setCronometro02([0, 0]);
    setTemposProcura([...TemposProcura, Cronometro02]);
    setAcertos(Acertos + 1);
  }

  const handleErro = () => {
    console.log('Errou');
    setErros(Erros + 1);
  }

  /**Funções para abrir os modais */
  const ChangeModalConfig = () => {
    setSeeModalConfig(!SeeModalConfig)
  };

  const ChangeModalEnd = () => {
    setSeeModalEnd(!SeeModalEnd)
  };

  const handleChangeConfig = (newConfig) => {
    setCtrlConfig(newConfig);
  };

  const handleKeyPress = (event) => {
    if (event.code === "ArrowUp") {
      handleStart();
    } else if (event.code === "ArrowDown") {
      handlePause();
    } else if (event.code === "ArrowLeft") {
      handleErro();
    } else if (event.code === "ArrowRight") {
      handleAcerto();
    } else if (event.code === "Escape") {
      ChangeModalEnd();
      handleReset();
    }
  }

  return (
    <>
      <div className='BodyDiv' onKeyDown={handleKeyPress} tabIndex={0}>
        <div className='CtrlPainel'>
          <span className='SpanButtons'>
            <button onClick={handleStart} ref={PlayButton}> <img src={Play} /></button>
            <button onClick={handlePause} ref={PauseButton}> <img src={Pause} /></button>
            <button onClick={() => { ChangeModalEnd(); handleReset(); }} ref={StopButton}> <img src={Stop} /></button>
            <button onClick={ChangeModalConfig}> <img src={Config} /></button>
          </span>
          <span className='CronGeral'>
            <p>{String(Cronometro01[0]).padStart(2, '0')}:{String(Cronometro01[1]).padStart(2, '0')}</p>
          </span>
        </div>
        <div className='NumberDiv'>
          {ListNumbers.map((number, index) => (
            <button className='ButtonNumbers' key={index}
              style={{ color: ButtonColors[index % ButtonColors.length] }}>{number}</button>
          ))}
        </div>
        <div className='Cronometro'>
          <span>{Erros}</span>
          <button ref={CheckButtons01} onClick={handleErro}>&#10006;</button>
          <span className='CronGeral'>{String(Cronometro02[0]).padStart(2, '0')}:{String(Cronometro02[1]).padStart(2, '0')}</span>
          <button ref={CheckButtons02} onClick={handleAcerto}>&#10004;</button>
          <span>{Acertos}</span>
        </div>
      </div>

      {SeeModalConfig ? <ConfigModal ChangeModalConfig={ChangeModalConfig} CtrlConfig={CtrlConfig} ChangeConfig={handleChangeConfig} /> : <></>}
      {SeeModalEnd ? <EndModal ChangeModalEnd={ChangeModalEnd} TempoTotal={TempoTotal} TemposProcura={TemposProcura} Acertos={Acertos} Erros={Erros} MedProcura={MedProcura} CtrlConfig={CtrlConfig}/> : <></>}

      <footer>

        <div className="social">
          {/* <a href="#"> <i className="fab fa-instagram"></i> </a> */}
          <a href="https://github.com/Bruhkamargo"> <i className="fab fa-github"></i> </a>
          <a href="https://wa.me/5549998193608"> <i className="fab fa-whatsapp"></i> </a>
        </div>
        <p>Copyright By <a href='https://bruhkamargo.github.io/HealthTec'><span className='Health'>Health</span>&<span className='Tec'>Tec</span></a></p>
      </footer>

    </>
  )
}

function ConfigModal({ ChangeModalConfig, CtrlConfig, ChangeConfig }) {
  const handleChange = (index, value) => {
    const newConfig = [...CtrlConfig];
    newConfig[index] = value;
    ChangeConfig(newConfig);
  };

  return (
    <div className='BackModal'>
      <div className='Modal'>
        <div className='ModalHead'>
          <h2>Configurações</h2>
        </div>
        <div className='ModalBody'>
          <span className='SpanBody'>
            <label>Tipo de Atividade: </label>
            <select className='SelectModal' value={CtrlConfig[0]} onChange={(e) => { handleChange(0, e.target.value) }}>
              <option value="Empty">... </option>
              <option value="Crescente">Crescente</option>
              <option value="Decrescente">Decrescente</option>
            </select>
          </span>
          <span className='SpanBody'>
            <label>Ativar Ajuda? </label>
            <label>Sim <input type="checkbox" checked={CtrlConfig[1]} onChange={(e) => { handleChange(1, !CtrlConfig[1]) }} /> </label>
          </span>
          <span className='SpanBody'>
            <label>Ativar Embaralhamento? </label>
            <label>Sim <input type="checkbox" checked={CtrlConfig[2]} onChange={(e) => { handleChange(2, !CtrlConfig[2]) }} /> </label>
          </span>
        </div>
        <div className='ModalFoot'>
          <button onClick={ChangeModalConfig}>Cancelar</button>
          <button onClick={() => { ChangeConfig(CtrlConfig); ChangeModalConfig(); }}>Salvar</button>
        </div>
      </div>
    </div>
  )
}

function EndModal({ ChangeModalEnd, TempoTotal, TemposProcura, Acertos, Erros, MedProcura, CtrlConfig }) {
  useEffect(() => {
    console.log(TemposProcura);
  }, [])

  return (
    <div className='BackModal'>
      <div className='Modal'>
        <div className='ModalHead'>
          <h2>Resultados</h2>
        </div>
        <div className='ModalBody'>
          <span className='SpanBody'>
            <label>Tempo Total: </label>
            <h3>{String(TempoTotal[0]).padStart(2, '0')}:{String(TempoTotal[1]).padStart(2, '0')}</h3>
          </span>
          <span className='SpanBody'>
            <label>Tempo Médio: </label>
            <h3>{String(MedProcura[0]).padStart(2, '0')}:{String(MedProcura[1]).padStart(2, '0')}</h3>
          </span>
          <span className='SpanBody'>
            <label>Acertos: </label>
            <h3>{Acertos}</h3>
          </span>
          <span className='SpanBody'>
            <label>Erros: </label>
            <h3>{Erros}</h3>
          </span>
          <span className='SpanBody'>
            <label>Atividade: </label>
            <h3>{CtrlConfig[0]}</h3>
          </span>

          <ul>
            {TemposProcura.map((parcial, index) => (
              <li key={index}>{String(parcial[0]).padStart(2, '0')}:{String(parcial[1]).padStart(2, '0')}</li>
            ))}
          </ul>
        </div>
        <div className='ModalFoot'>
          <button onClick={ChangeModalEnd}>Cancelar</button>
          <button>Salvar</button>
        </div>
      </div>
    </div>
  )
}
export default HomePage

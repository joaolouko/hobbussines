import { useState } from "react";
import Logo from './images/LogoHobb.png';
import { motion, AnimatePresence } from "framer-motion";
import Swal from 'sweetalert2';
import Fuse from "fuse.js";

const palavrasChave: Record<string, string[]> = {
  cozinheiro: ["cozinhar", "cozinheiro", "culinária", "comida"],
  jogar: ["jogar", "games", "video game", "videogame"],
  futebol: ["futebol", "bola", "jogar bola", "soccer"],
  academia: ["academia", "musculação", "malhar", "treinar"],
  correr: ["correr", "corrida", "maratona"],
  "degustar vinho": ["vinho", "degustar vinho", "enologia"],
  ler: ["ler", "livros", "leitura"],
  desenhar: ["desenhar", "desenho", "arte", "pintar"],
  "ouvir musica": ["música", "ouvir música", "cantar", "playlist"],
  festa: ["festa", "balada", "evento", "celebração"]
};

// Junta todas as palavras-chave em uma lista com referência ao hobby original
const todasPalavras: { termo: string; hobby: string }[] = [];

for (const [hobby, palavras] of Object.entries(palavrasChave)) {
  palavras.forEach((termo) => todasPalavras.push({ termo, hobby }));
}

// Cria instância do Fuse
const fuse = new Fuse(todasPalavras, {
  keys: ["termo"],
  threshold: 0.4 // quanto menor, mais exato; 0.4 tolera erros razoáveis
});

export function normalizarHobby(input: string): string {
  const entrada = input.toLowerCase().trim();
  const resultado = fuse.search(entrada);
  if (resultado.length > 0) {
    return resultado[0].item.hobby;
  }
  return "não identificado";
}

function App() {
  const [showResult, setShowResult] = useState(false);
  const [hobby, setHobby] = useState("");

  const dicas: Record<string, string> = {
    cozinheiro: "Você pode transformar seu hobby de cozinheiro em um negócio oferecendo marmitas, cursos online ou criando conteúdo culinário nas redes sociais!",
    jogar: "Você pode streamar suas partidas, criar conteúdo para YouTube ou oferecer coaching para jogadores iniciantes.",
    futebol: "Considere dar aulas para crianças, organizar campeonatos locais ou até abrir uma escolinha de futebol.",
    academia: "Você pode se tornar personal trainer, criar treinos online ou vender planos de treino e dieta personalizados.",
    correr: "Crie um blog sobre corrida, participe de eventos e venda produtos ou serviços voltados a corredores.",
    "degustar vinho": "Você pode criar um canal de degustação, promover eventos de vinho ou até abrir um clube de assinaturas.",
    ler: "Você pode criar resenhas online, vender eBooks ou até abrir um clube de leitura pago.",
    desenhar: "Ofereça suas artes como comissões, venda prints online ou ensine pessoas a desenhar.",
    "ouvir musica": "Crie playlists curadas, seja DJ, produtor musical ou crie conteúdo sobre análise musical.",
    festa: "Organize eventos, trabalhe com decoração, produção de festas ou DJ para aniversários e casamentos."
  };

  const handleGenerateClick = () => {
    if (hobby.trim() === "") {
      Swal.fire({
        icon: 'warning',
        title: 'Campo vazio!',
        text: 'Por favor, insira seu hobby antes de continuar.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    setShowResult(true);
  };

  const hobbyNormalizado = normalizarHobby(hobby);
  const dica = dicas[hobbyNormalizado];



  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-white gap-3 overflow-hidden">
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center gap-3"
          >
            <img src={Logo} className="absolute bottom-82" />
            <h1 className="text-gray-700 font-extrabold text-[40px] mt-20">Insira seu hobby!</h1>
            <div className="bg-amber-400 rounded-lg p-4 w-[600px] max-w-full">
              <input
                type="text"
                value={hobby}
                onChange={(e) => setHobby(e.target.value)}
                className="w-full h-20 rounded-none text-4xl font-black text-white"
                aria-label="Campo para inserir seu hobby"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGenerateClick}
              className="bg-green-600 text-5xl p-1 pr-10 pl-10 rounded-lg"
            >
              Gerar
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center gap-5 max-w-2xl text-center px-4"
          >
            <h2 className="text-3xl font-bold text-gray-700">
              Seu hobby é: {hobbyNormalizado === "não identificado" ? "não identificado" : hobbyNormalizado}
            </h2>

            {dica ? (
              <p className="text-xl text-green-700">Dica: {dica}</p>
            ) : (
              <p className="text-xl text-red-600">Não encontramos sugestões para esse hobby.</p>
            )}

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowResult(false)}
              className="bg-blue-600 text-2xl p-2 px-8 rounded-lg"
            >
              Voltar
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

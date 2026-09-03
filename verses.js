/**
 * Banco de versículos bíblicos motivacionais e de encorajamento
 * Selecionados para alegrar o dia na daily!
 */

const BIBLE_VERSES = [
    { text: "O Senhor é o meu pastor; nada me faltará.", ref: "Salmos 23:1" },
    { text: "Tudo posso naquele que me fortalece.", ref: "Filipenses 4:13" },
    { text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.", ref: "João 3:16" },
    { text: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.", ref: "Provérbios 3:5" },
    { text: "O Senhor é a minha luz e a minha salvação; a quem temerei?", ref: "Salmos 27:1" },
    { text: "Mas os que esperam no Senhor renovarão as suas forças; subirão com asas como águias.", ref: "Isaías 40:31" },
    { text: "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus.", ref: "Isaías 41:10" },
    { text: "Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco.", ref: "1 Tessalonicenses 5:18" },
    { text: "O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha.", ref: "1 Coríntios 13:4" },
    { text: "Alegrem-se sempre no Senhor. Novamente direi: alegrem-se!", ref: "Filipenses 4:4" },
    { text: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.", ref: "Jeremias 29:11" },
    { text: "Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará.", ref: "Salmos 37:5" },
    { text: "Deem graças ao Senhor porque ele é bom; o seu amor dura para sempre.", ref: "Salmos 107:1" },
    { text: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.", ref: "Mateus 11:28" },
    { text: "Este é o dia que o Senhor fez; regozijemo-nos e alegremo-nos nele.", ref: "Salmos 118:24" },
    { text: "Sejam fortes e corajosos. Não tenham medo nem fiquem apavorados, pois o Senhor, o seu Deus, vai com vocês; nunca os deixará, nunca os abandonará.", ref: "Deuteronômio 31:6" },
    { text: "Buscai primeiro o Reino de Deus e a sua justiça, e todas essas coisas vos serão acrescentadas.", ref: "Mateus 6:33" },
    { text: "Porque onde estiverem dois ou três reunidos em meu nome, ali eu estou no meio deles.", ref: "Mateus 18:20" },
    { text: "O Senhor abençoe e guarde vocês; o Senhor faça resplandecer o seu rosto sobre vocês e lhes conceda graça.", ref: "Números 6:24-25" },
    { text: "Eu sou o caminho, a verdade e a vida.", ref: "João 14:6" },
    { text: "A paz vos deixo, a minha paz vos dou; não vo-la dou como o mundo a dá.", ref: "João 14:27" },
    { text: "Lâmpada para os meus pés é tua palavra, e luz para o meu caminho.", ref: "Salmos 119:105" },
    { text: "Sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus.", ref: "Romanos 8:28" },
    { text: "Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia.", ref: "Salmos 46:1" },
    { text: "Não andeis ansiosos por coisa alguma; em tudo, porém, sejam conhecidas diante de Deus as vossas petições, pela oração e pela súplica, com ações de graças.", ref: "Filipenses 4:6" },
    { text: "Grande é a sua fidelidade; as suas misericórdias se renovam a cada manhã.", ref: "Lamentações 3:23" },
    { text: "O fruto do Espírito é: amor, alegria, paz, paciência, amabilidade, bondade, fidelidade, mansidão e domínio próprio.", ref: "Gálatas 5:22-23" },
    { text: "Pois estreita é a porta, e apertado o caminho que leva à vida, e poucos há que a encontrem.", ref: "Mateus 7:14" },
    { text: "Combati o bom combate, acabei a carreira, guardei a fé.", ref: "2 Timóteo 4:7" },
    { text: "O Senhor é bom, um refúgio em tempos de angústia. Ele protege os que nele confiam.", ref: "Naum 1:7" },
    { text: "Mas, para vós que temeis o meu nome, nascerá o sol da justiça, e cura trará nas suas asas.", ref: "Malaquias 4:2" },
    { text: "Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará.", ref: "Salmos 91:1" },
    { text: "Ensinai-nos a contar os nossos dias, para que alcancemos coração sábio.", ref: "Salmos 90:12" },
    { text: "Clama a mim, e responder-te-ei, e anunciar-te-ei coisas grandes e firmes, que não sabes.", ref: "Jeremias 33:3" },
    { text: "Quando estou com medo, eu confio em ti.", ref: "Salmos 56:3" },
    { text: "Bendize, ó minha alma, ao Senhor, e tudo o que há em mim bendiga o seu santo nome.", ref: "Salmos 103:1" },
    { text: "Eu te amo, ó Senhor, força minha.", ref: "Salmos 18:1" },
    { text: "Quão grande é a tua bondade, que guardaste para os que te temem!", ref: "Salmos 31:19" },
    { text: "Não se turbe o vosso coração; credes em Deus, crede também em mim.", ref: "João 14:1" },
    { text: "Ora, a fé é a certeza daquilo que esperamos e a prova das coisas que não vemos.", ref: "Hebreus 11:1" },
    { text: "Sê forte e corajoso; não temas, nem te espantes; porque o Senhor teu Deus é contigo, por onde quer que andares.", ref: "Josué 1:9" },
    { text: "O justo viverá pela fé.", ref: "Romanos 1:17" },
    { text: "Pedi, e dar-se-vos-á; buscai, e encontrareis; batei, e abrir-se-vos-á.", ref: "Mateus 7:7" },
    { text: "Deus não nos deu espírito de covardia, mas de poder, de amor e de equilíbrio.", ref: "2 Timóteo 1:7" },
    { text: "Se Deus é por nós, quem será contra nós?", ref: "Romanos 8:31" },
    { text: "Deleita-te também no Senhor, e ele te concederá o que deseja o teu coração.", ref: "Salmos 37:4" },
    { text: "Portanto, quer comais, quer bebais ou façais outra qualquer coisa, fazei tudo para a glória de Deus.", ref: "1 Coríntios 10:31" },
    { text: "O homem não vive só de pão, mas de toda palavra que procede da boca de Deus.", ref: "Mateus 4:4" },
    { text: "Sede misericordiosos, como também é misericordioso vosso Pai.", ref: "Lucas 6:36" },
    { text: "Eu vim para que tenham vida, e a tenham com abundância.", ref: "João 10:10" },
    { text: "Eis que faço novas todas as coisas.", ref: "Apocalipse 21:5" },
    { text: "O Senhor é fiel e há de fortalecê-los e guardá-los do maligno.", ref: "2 Tessalonicenses 3:3" },
    { text: "Mas a vereda dos justos é como a luz da aurora, que vai brilhando mais e mais até ser dia perfeito.", ref: "Provérbios 4:18" },
    { text: "Antes de te formar no ventre te conheci, e antes que saísses da madre, te santifiquei.", ref: "Jeremias 1:5" },
    { text: "Cada um contribua segundo propôs no seu coração; não com tristeza, ou por necessidade; porque Deus ama ao que dá com alegria.", ref: "2 Coríntios 9:7" },
    { text: "Eu, porém, cantarei a tua força; pela manhã louvarei com alegria a tua misericórdia.", ref: "Salmos 59:16" },
    { text: "De manhã ouvirás a minha voz; de manhã me apresentarei a ti, e vigiarei.", ref: "Salmos 5:3" },
    { text: "Provai e vede que o Senhor é bom; bem-aventurado o homem que nele confia.", ref: "Salmos 34:8" },
    { text: "Agora, pois, permanecem a fé, a esperança e o amor, estes três; mas o maior destes é o amor.", ref: "1 Coríntios 13:13" },
    { text: "Não vos conformeis com este mundo, mas transformai-vos pela renovação da vossa mente.", ref: "Romanos 12:2" },
    { text: "Mas, buscai primeiro o reino de Deus, e a sua justiça, e todas estas coisas vos serão acrescentadas.", ref: "Mateus 6:33" },
    { text: "Misericórdias do Senhor são a causa de não sermos consumidos; porque as suas misericórdias não têm fim.", ref: "Lamentações 3:22" },
    { text: "Tenham bom ânimo, eu venci o mundo.", ref: "João 16:33" },
    { text: "Tudo tem o seu tempo determinado, e há tempo para todo o propósito debaixo do céu.", ref: "Eclesiastes 3:1" },
    { text: "Louvai ao Senhor. Louvai ao Senhor, porque ele é bom; porque a sua benignidade dura para sempre.", ref: "Salmos 106:1" },
    { text: "Uns confiam em carros e outros em cavalos, mas nós faremos menção do nome do Senhor nosso Deus.", ref: "Salmos 20:7" },
    { text: "Esforçai-vos, e ele fortalecerá o vosso coração, vós todos que esperais no Senhor.", ref: "Salmos 31:24" },
    { text: "Toda boa dádiva e todo dom perfeito vem do alto, descendo do Pai das luzes.", ref: "Tiago 1:17" },
    { text: "Assim brilhe a vossa luz diante dos homens, para que vejam as vossas boas obras e glorifiquem a vosso Pai, que está nos céus.", ref: "Mateus 5:16" },
    { text: "Acheguemo-nos com confiança ao trono da graça, a fim de recebermos misericórdia e encontrarmos graça para socorro em momento oportuno.", ref: "Hebreus 4:16" },
];

class VerseService {
    constructor() {
        this.usedIndices = [];
    }

    /**
     * Retorna um versículo aleatório (evitando repetições enquanto possível)
     */
    getRandomVerse() {
        // Se já usou todos, resetar
        if (this.usedIndices.length >= BIBLE_VERSES.length) {
            this.usedIndices = [];
        }

        let index;
        do {
            index = Math.floor(Math.random() * BIBLE_VERSES.length);
        } while (this.usedIndices.includes(index));

        this.usedIndices.push(index);
        return BIBLE_VERSES[index];
    }

    /**
     * Tenta buscar um versículo de uma API online (fallback para local)
     */
    async getVerseOnline() {
        try {
            // API gratuita da Bíblia em português
            const response = await fetch('https://bible-api.com/?random=verse&translation=almeida');
            if (response.ok) {
                const data = await response.json();
                return {
                    text: data.text.trim(),
                    ref: data.reference
                };
            }
        } catch (error) {
            console.warn('API offline, usando versículo local:', error);
        }
        
        // Fallback para banco local
        return this.getRandomVerse();
    }

    /**
     * Retorna versículo - tenta online, fallback local
     */
    async getVerse() {
        return this.getRandomVerse(); // Usar local para garantir rapidez
    }
}

const verseService = new VerseService();

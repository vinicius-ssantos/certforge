# ADR 0018: O mantenedor pode revisar o próprio trabalho, e o registro diz isso

- Status: **Aceita**
- Data: 2026-10-17
- Issue: nenhuma; surgiu ao avaliar a lista de revisão contra a fila real

## Contexto

Duas promessas vinham andando juntas neste projeto como se fossem uma só.

A primeira é a [ADR 0005](0005-ai-not-source-of-truth.md): **uma pessoa, não uma máquina, é a fonte da correção técnica.** É a única promessa que o produto faz sobre o conteúdo dele, e ela vale com um mantenedor só.

A segunda é a **revisão independente**: quem aprova uma questão não é quem a escreveu. A API editorial impunha isso com `reviewer_must_differ_from_author`, e até agora a única exceção era um interruptor de instalação inteira, `certforge.question-bank.require-reviewer-separation`.

A segunda promessa nunca foi verdade aqui, e os registros do próprio projeto dizem isso. A redação em português foi revisada por "o próprio autor do projeto, não um revisor independente" ([ADR 0012](0012-interface-language.md)). O pacote de setenta questões de DevOps registra nos próprios caveats da `review.json` que não é "independent second-reviewer validation". O projeto é uma pessoa, e a regra estava recusando o único revisor que ele tem.

O interruptor era a forma errada de resolver. Ele desliga a separação para *todo mundo*: no dia em que um colaborador for adicionado como autor, esse colaborador pode aprovar as próprias questões, e nada no produto perceberia. Liga-se o interruptor por causa do mantenedor e perde-se a regra, em silêncio, para todos os outros.

Duas contas da mesma pessoa é pior que qualquer das duas. Satisfaz a trava e grava uma decisão cujo id de revisor difere do id de autor — que é exatamente a forma de uma revisão independente. O registro passaria a afirmar algo que não aconteceu.

## Decisão

**Uma revisão só pode ser revisada por quem a escreveu se a conta tiver `CONTENT_SELF_REVIEW`, permissão concedida apenas pelo papel de administrador. Todo outro autor continua precisando de outra pessoa.**

O interruptor de instalação e as propriedades `certforge.question-bank` que o carregavam foram removidos. Um mecanismo substitui dois, e sobra o mais estreito.

A permissão é nomeada em vez de inferida do papel, porque o `Permission` diz que papéis só agrupam permissões e nunca são checados diretamente, e porque as duas coisas são de fato diferentes: `CONTENT_REVIEW` é "pode conferir trabalho", `CONTENT_SELF_REVIEW` é "de quem é a palavra final quando não há mais ninguém para conferir".

**Auto-revisão é aceita, nunca disfarçada.** Nenhuma coluna nova foi preciso: uma revisão cujo `reviewer_id` é igual ao `author_id` da versão é uma auto-revisão, e o banco já guardava os dois. O que faltava era alguém dizer. O desk editorial agora lê uma decisão do autor como "auto-revisão: quem revisou foi quem escreveu", a confirmação de publicação nomeia quem aprovou como "revisando o próprio trabalho", e a lista de revisão avisa, antes do clique, que aprovar a própria versão será registrado como auto-revisão.

## Consequências

Uma instância de um mantenedor funciona sem configuração e sem fingimento. O mantenedor aprova as próprias questões, e todo registro dessas aprovações diz quem as fez e que revisor e autor eram a mesma pessoa.

Um projeto com duas pessoas mantém a regra forte de graça: um autor que não é administrador não pode aprovar o próprio trabalho, e não existe interruptor que o libere.

A suíte ponta a ponta não relaxa mais nada de separação. Suas fixtures publicam como o administrador de bootstrap, que tem a permissão, então o relaxamento que ela exigia saiu do `compose.e2e.yaml`, do `ci.yml` e do README do web.

O que isto **não** faz é tornar uma auto-revisão tão boa quanto uma independente. Não é: o valor de um segundo leitor é ele ainda não acreditar na resposta. O projeto deve dizer, no que publicar sobre o conteúdo, que aprovações numa instância de mantenedor único são auto-revisões. Esta ADR é o que torna essa afirmação verificável em vez de lembrada.

## Alternativas rejeitadas

**Manter o interruptor e desligá-lo.** O mais simples e o mais perigoso: remove a regra para todo autor futuro e deixa o registro incapaz de distinguir auto-revisão de revisão independente.

**Checar o papel `ADMINISTRATOR` no serviço editorial.** Mesmo comportamento hoje, mas contradiz a regra de que papéis nunca são checados diretamente, e amarra uma autoridade editorial a uma operacional: uma conta tornada administradora para rodar deploys ganharia, em silêncio, o direito de aprovar as próprias questões.

**Uma segunda conta da mesma pessoa.** Satisfaz a trava falsificando o registro. Rejeitada pelo mesmo motivo da ADR 0005: a proveniência tem de descrever o que aconteceu de fato.

**Gravar uma flag em cada decisão.** Desnecessário. `reviewer_id` e `author_id` já são guardados; a distinção é derivável, e um fato derivado não diverge do dado que o origina.

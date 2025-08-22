import { type ChatDetailDto } from "@/types";
import ChatForm from "./chat-form";

interface Props {
  initialMessages: ChatDetailDto | null;
}

function Chat(props: Props) {
  const { initialMessages } = props;


  return (
    <div className="flex flex-col h-full max-h-full overflow-hidden min-h-0">
      {/* <ChatHeader /> */}
      <main className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto p-4">
          {initialMessages ? (
            initialMessages.messages.map((message) => (
              <div key={message.id} className={`mb-2 flex ${message.author.id === initialMessages.author.id ? "justify-end" : "justify-start"}`}>
                <strong>{message.author.id}</strong>: {message.content}
              </div>
            ))
          ) : (
            <div className="">
              No messages Lorem ipsum dolor, sit amet consectetur adipisicing
              elit. Nam est corrupti debitis doloremque, voluptatem beatae
              officiis rerum! Laborum voluptatum tenetur, doloremque soluta
              dignissimos ut sit saepe tempore recusandae sapiente harum?
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis eveniet porro dolor similique enim, est exercitationem ullam, soluta, obcaecati sint consequatur repudiandae saepe repellendus tempora? Reprehenderit animi a consequatur asperiores!
              Numquam nam possimus labore porro sunt asperiores aliquid at quis tempore iste! Temporibus, voluptatem deserunt consequuntur laboriosam sed dignissimos veritatis vitae alias consectetur, maiores blanditiis? Vel expedita fugit animi voluptate.
              Explicabo labore tenetur repellendus optio quia tempora ducimus ipsam suscipit dignissimos, rerum id nisi modi eveniet eos magnam. Molestias nesciunt voluptate tempore quasi et quibusdam suscipit eligendi, illo recusandae modi.
              Dolore mollitia tenetur, pariatur beatae natus et eaque laudantium repellendus ipsa hic tempora dicta delectus adipisci, sit accusantium accusamus consequuntur! Beatae quas deleniti velit modi ab commodi, rerum accusantium laborum.
              Vitae aspernatur laboriosam incidunt itaque voluptates nihil, suscipit sapiente quaerat rerum iste amet exercitationem voluptas blanditiis quis dignissimos quo nobis iusto dicta fugit animi. Aut ratione culpa qui praesentium laborum!
              Dicta, aliquam unde quisquam ex obcaecati quod, cupiditate, mollitia vel voluptate fuga delectus natus maxime illo neque quam officiis provident blanditiis! Architecto repudiandae numquam sint quasi repellendus tenetur ea aliquid!
              Necessitatibus sint accusamus esse officiis temporibus explicabo minus veritatis repellat eius placeat maxime eveniet neque deleniti cupiditate impedit exercitationem voluptates consequuntur ad maiores perferendis vero, odio excepturi. Optio, sed ullam!
              Animi fuga error ab magnam ipsa libero laborum quod, consequatur sunt. Dicta quis quibusdam sunt, explicabo perspiciatis amet maiores impedit quod earum, adipisci omnis hic repudiandae iusto aliquid laborum quo!
              Nihil ducimus tempora sunt doloribus ut illo ad, blanditiis voluptatibus reiciendis magnam. Doloremque, soluta fuga. Ipsa voluptate corrupti libero pariatur laboriosam fuga adipisci corporis assumenda, voluptatum, delectus error nemo maxime!
              Harum commodi alias tenetur reiciendis nostrum pariatur hic. Veritatis eaque harum aliquam facilis dicta ullam libero autem vel necessitatibus voluptatibus nobis ipsum nostrum hic impedit dolor nihil, neque iste porro!
              Ipsa facilis cupiditate delectus quia laboriosam dolores, alias voluptatem autem voluptates. Molestias iste, omnis a error nostrum adipisci eius inventore ullam necessitatibus accusamus, saepe assumenda sapiente voluptatibus ducimus vitae cumque?
              Ipsum aliquam quis quaerat qui fuga exercitationem eveniet quisquam dolor praesentium iste nulla temporibus nemo maiores inventore necessitatibus harum quibusdam eaque deleniti, maxime fugit modi numquam vitae adipisci! Consectetur, dolorem.
              Ullam sunt maiores necessitatibus est incidunt ab fuga, dolorum voluptatum deleniti nostrum. Perferendis eum voluptates, repellat doloribus dolores asperiores magnam ullam, ex libero eveniet fuga amet, qui incidunt quasi aut.
              Obcaecati architecto voluptates dicta voluptate nesciunt sint repellendus nisi quis laborum deserunt nemo animi fugit tenetur laboriosam amet neque reprehenderit eaque in sequi aperiam repellat quibusdam, harum perspiciatis. Sapiente, architecto?
              Eligendi dolor vitae debitis assumenda quidem nam, inventore perspiciatis facilis alias incidunt temporibus saepe quam corporis aut, quo nesciunt asperiores repellat atque maiores eius. Ipsam expedita reiciendis voluptatem sunt tempore.
              Autem quisquam cupiditate dolor quasi nam repellat deserunt minima quidem nihil impedit! Impedit necessitatibus ipsa et obcaecati nemo, dicta alias sed hic laboriosam dolorem id adipisci dignissimos fuga in molestias!
              Ea quae iure beatae rerum hic corporis libero voluptas amet fuga voluptatem? Nostrum quibusdam aliquam optio aliquid? Impedit laboriosam voluptates delectus eos quam exercitationem ullam doloremque sint accusantium. Unde, fugiat.
              Accusantium, veritatis saepe? Quod eos, porro cupiditate consequuntur dolor fugit. Magnam animi enim doloribus fuga nam incidunt quo ex laborum velit, ipsum, eos impedit dolore, aut reprehenderit delectus soluta debitis!
              Ab unde error soluta dolor repellendus ipsa fugit natus reprehenderit eos mollitia recusandae adipisci sed porro fugiat, nemo esse odio. Ipsa commodi officia nam ipsam voluptatem aliquam porro rerum distinctio!
              Laborum nulla dicta, vitae quam tenetur, maiores commodi blanditiis id atque dignissimos nisi rerum exercitationem! Labore rerum, ex, facere ut quo vero deserunt eligendi quos commodi placeat maxime, omnis quaerat.
              Debitis repellendus porro, error expedita aliquid unde necessitatibus quisquam animi obcaecati neque magnam repudiandae quas illo impedit, recusandae eos alias. Est ipsum beatae facere ut adipisci sit neque esse voluptatibus?
              Unde maxime aliquam numquam voluptas, ab aut, consequuntur error iste omnis dolores perspiciatis quos veritatis voluptatum placeat necessitatibus, rem temporibus excepturi ut! At odit facere repudiandae laudantium aliquid voluptatum adipisci?
              Neque optio quisquam tempora, eaque perferendis enim praesentium repellendus eum earum ipsum? Repudiandae, unde! Magni explicabo fuga ducimus dolor omnis nobis optio tempore! Architecto, consequatur unde? Recusandae et totam porro.
              Enim, itaque molestias. Fugit, laborum. Ab iste omnis tenetur praesentium perspiciatis ad est cum non tempore molestiae nobis ratione, dolor impedit minus quaerat blanditiis. Nemo quo animi voluptatum odio et!
              Saepe labore cupiditate porro iste tempora! Rem dolore, ut vitae temporibus nostrum adipisci! Adipisci iusto facilis debitis saepe impedit illo, dolores, facere quibusdam accusantium repudiandae tempora excepturi dolore deleniti eius.
            </div>
          )}
        </div>
        <div className="p-4 h-20 shrink-0">
          <ChatForm onSendMessage={(message) => console.log(message)} />
        </div>
      </main>
    </div>
  );
}

export default Chat;

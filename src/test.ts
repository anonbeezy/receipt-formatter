import 'dotenv/config';
import { rootApp } from './main';

// https://i.imgur.com/JCjLTZR.jpeg
(async () => {
  //   const result = await rootApp.invoke(
  //     { imageUrl: 'https://i.imgur.com/JCjLTZR.jpeg' },
  //     { debug: true },
  //   );
  //   console.log(JSON.stringify(result, null, 2));

  const result = await rootApp.stream(
    { imageUrl: 'https://i.imgur.com/JCjLTZR.jpeg' },
    {
      debug: true,
      configurable: {
        thread_id: '1',
      },
      streamMode: 'debug',
      subgraphs: true,
    },
  );
  for await (const update of result) {
    console.log(JSON.stringify(update, null, 2));
  }
})();

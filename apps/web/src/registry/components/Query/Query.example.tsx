import { queryOptions } from "@tanstack/react-query";
import Query from "./Query";

interface User {
  name: string;
  age: number;
  email?: string;
}

const sampleAsyncFn = () => {
  return new Promise<User[]>((resolve) =>
    setTimeout(() => {
      resolve([
        {
          name: "John",
          age: 20,
          email: "john@gmail.com",
        },
        {
          name: "Michael",
          age: 23,
        },
        {
          name: "Alice",
          age: 21,
          email: "alice@gmail.com",
        },
      ]);
    }, 300)
  );
};

export default function QueryExample() {
  const sampleUseQuery = queryOptions({
    queryKey: ["user", "list"],
    queryFn: sampleAsyncFn,
  });

  return (
    <Query {...sampleUseQuery}>
      {({ data, status }) => (
        <>
          {(() => {
            switch (status) {
              case "pending":
                return <div>loading...</div>;
              case "error":
                return <div>oops, something went wrong!</div>;
              case "success":
                return data.map((item) => (
                  <ul key={item.name}>
                    <li>
                      <label>Name : </label>
                      <span>{item.name}</span>
                    </li>
                    <li>
                      <label>Age : </label>
                      <span>{item.age}</span>
                    </li>
                    {item.email ? (
                      <li>
                        <label>Email : </label>
                        <span>{item.email}</span>
                      </li>
                    ) : (
                      <p>* no email</p>
                    )}
                  </ul>
                ));
            }
          })()}
        </>
      )}
    </Query>
  );
}

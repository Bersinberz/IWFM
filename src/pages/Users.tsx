import { Container, Table } from "react-bootstrap";

interface User {
  id: number;
  name: string;
  role: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: "Aditi Sharma", role: "Admin", email: "aditi@iwfm.local" },
  { id: 2, name: "Rahul Menon", role: "Dispatcher", email: "rahul@iwfm.local" },
  { id: 3, name: "Priya Nair", role: "Quality", email: "priya@iwfm.local" },
];

export default function Users() {
  return (
    <Container className="p-4">
      <h3>Users</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th><th>Name</th><th>Role</th><th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.role}</td>
              <td>{u.email}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

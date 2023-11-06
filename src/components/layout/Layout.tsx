import { ReactNode } from 'react';
import Container from '@mui/material/Container';

type LayoutProps = {
  children: ReactNode;
};
export default function Layout({ children } : LayoutProps){
  return (
    <Container>
      {children}
    </Container>
  )
}
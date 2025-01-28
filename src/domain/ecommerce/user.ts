import { Entity } from 'core/entities/Entity';
import { INormalizedUser } from 'shared/types';

export interface UserProps extends INormalizedUser {
  id: number;
  // orders?: Order[];
}

export class User extends Entity<UserProps> {
  constructor(props: UserProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }
  get firstName(): string | null {
    return this.props.firstName;
  }
  get lastName(): string | null {
    return this.props.lastName;
  }
  get telephone(): number | null {
    return this.props.telephone;
  }

  // get order(): string[] {
  //   return this.order;
  // }

  get currentState(): UserProps {
    return this.props;
  }
}

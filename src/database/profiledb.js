import { Model } from '@nozbe/watermelondb';
import { field , readonly ,date} from '@nozbe/watermelondb/decorators';

export default class Profiledb extends Model {
  static table = 'profiledata';
  @field('name') name;
  @field('lname') lname;
  @field('email') email;
  @field('profile') profile;
}

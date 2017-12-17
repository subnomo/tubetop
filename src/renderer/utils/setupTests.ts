import { configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

// Mock immutablejs
export function mockState(returnVal: any, globalKey: string, localKey?: string): any {
  return {
    get: (s: string) => {
      if (s !== globalKey) return;

      return {
        get: (s: string) => {
          if (s !== (localKey || globalKey)) return;

          return returnVal;
        }
      };
    }
  };
}

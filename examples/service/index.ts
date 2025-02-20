import dbus, { Variant, DBusError } from '@particle/dbus-next';

const {
  Interface, property, method, signal,
  ACCESS_READ, ACCESS_WRITE, ACCESS_READWRITE
} = dbus.interface;

export class ExampleInterface extends Interface {
  // Can be changed internally or from the outside, but must manually emit properties changed like in set MapProperty
  @property({ signature: 's', access: ACCESS_READWRITE })
  SimpleProperty = 'foo';

  _MapProperty: Record<string, Variant> = {
    'foo': new Variant('s', 'bar'),
    'bat': new Variant('i', 53)
  };

  @property({ signature: 'a{sv}' })
  get MapProperty(): Record<string, Variant> {
    return this._MapProperty;
  }

  set MapProperty(value: Record<string, Variant>) {
    this._MapProperty = value;

    Interface.emitPropertiesChanged(
        this,
        { MapProperty: value },
        []
    );
  }

  @method({ inSignature: 's', outSignature: 's' })
  Echo(what: string): string {
    return what;
  }

  @method({ inSignature: 'ss', outSignature: 'vv' })
  ReturnsMultiple(what: string, what2: string) {
    return [
      new Variant('s', what),
      new Variant('s', what2)
    ];
  }

  @method({ inSignature: '', outSignature: '' })
  ThrowsError(): void {
    // the error is returned to the client
    throw new DBusError('org.test.iface.Error', 'something went wrong');
  }

  @method({ inSignature: '', outSignature: '', noReply: true })
  NoReply(): void {
    // by setting noReply to true, dbus-next will NOT send a return reply through dbus
    // after the method is called.
  }

  @signal({ signature: 's' })
  HelloWorld(value: string): string {
    // Transform value before emit
    return value;
  }

  @signal({ signature: 'ss' })
  SignalMultiple(x) {
    return [
      'hello',
      'world'
    ];
  }
}

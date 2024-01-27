beforeEach(()=>{
    return { SpotPrice } = require("./SpotPrice");
});

test('Time of update not exactly 2 parameter raises error', ()=>{

    expect(()=>{
        const timeForUpdate = [3,5,6];
        new SpotPrice(timeForUpdate);
    
    }).toThrow('Not exactly 2 parameters given');

    expect(()=>{
        const timeForUpdate = [3];
        new SpotPrice(timeForUpdate);
    
    }).toThrow('Not exactly 2 parameters given');

});

test('Time of update non-integer values raises error',()=>{

    expect(()=>{

        const timeForUpdate = [3,5.3];
        new SpotPrice(timeForUpdate);

    }).toThrow('Not number parameter given');

    expect(()=>{

        const timeForUpdate = [3,"5"];
        new SpotPrice(timeForUpdate);

    }).toThrow('Not number parameter given');

});

test('Invalid time paramters raises error',()=>{

    expect(()=>{
        const timeForUpdate = [-3,5];
        new SpotPrice(timeForUpdate);
    }).toThrow('Negative number given.');

    expect(()=>{
        const timeForUpdate = [24,6];
        new SpotPrice(timeForUpdate);
    }).toThrow('Hour cannot be over 23.');

    expect(()=>{
        const timeForUpdate = [6,60];
        new SpotPrice(timeForUpdate);
    }).toThrow('Minutes cannot be over 59.');

});
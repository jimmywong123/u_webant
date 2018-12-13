
import request from '../../src/utils/request'

describe('src/utils/request', () => {
  it('', async () => {
    const res = await request('http://baidu.com')

    expect(res).toMatch('百度')
  })
});


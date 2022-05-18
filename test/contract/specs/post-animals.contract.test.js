import { provider } from '../config/init-pact';
import { Matchers } from '@pact-foundation/pact';
import { AnimalController } from '../../../controllers';

describe('Animal Service', () => {
    describe('When a request to list all animals is made', () => {
        beforeAll(async () => {
            await provider.setup();
            await provider.addInteraction({
                uponReceiving: 'a request to list all animals',
                state: "has animals",
                withRequest: {
                    method: 'POST',
                    path: '/animals'
                },
                willRespondWith: {
                    status: 200,
                    body: Matchers.eachLike(
                        {
                            name: Matchers.like('manchas'),
                            breed: Matchers.like("Bengali"),
                            gender: Matchers.like("Female"),
                            vaccinated: Matchers.boolean(true)
                        }
                    )
                }
            });
        });
        test('should return the correct data', async () => {
            const animal = {
                name: 'manchas',
                breed: 'Bengali',
                gender: 'Female',
                vaccinated: true
            }
            const response = await AnimalController.register(animal);
            expect(response.data).toMatchSnapshot();
            await provider.verify()

        });
        afterAll(() => provider.finalize());
    });
});

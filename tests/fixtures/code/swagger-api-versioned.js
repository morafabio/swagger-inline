/*
 * @api [put] /pets
 *    operationId: "findPets"
 */
router.put('/pets', () => {});

/*
 * @api [post] /pets
 *    since: 1.5.0
 *    operationId: "addPet"
 */
router.post('/pets', () => {});

/*
 * @api [get] /pets/{id}
 *    until: 2.0.0
 *    operationId: "findPetById"
 */
router.get('/pets/{id}', () => {});

/*
 * @api [delete] /pets/{id}
 *    since: 1.5.0
 *    until: 3.0.0
 *    operationId: "deletePet"
 */
router.delete('/pets/{id}', () => {});

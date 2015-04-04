# todo

+it should publish createPerson() on the scope

+it should call api.createPerson(), then execute()

if api.createPerson() succeeds
  it should change $location.path
  it should resolve a promise without an error

if api.createPerson() fails
  if ValidationError
    it should return the rejection with error map
  if non-ValidationError
    it should throw ($exceptionHandler)

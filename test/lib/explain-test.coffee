describe '.explain', ->
  Given -> @explain = requireSubject('lib/explain')
  Given -> @create = requireSubject('lib/create')
  Given -> @when = requireSubject('lib/when')

  Given -> @testDouble = @create()
  When -> @result = @explain(@testDouble)

  context 'a brand new test double', ->
    Then -> expect(@result).to.deep.eq
      calls: []
      callCount: 0
      description: """
      This test double has 0 stubbings and 0 invocations.
      """

  context 'a double with some interactions', ->
    Given -> @when(@testDouble(88)).thenReturn(5)
    Given -> @testDouble(88)
    Given -> @testDouble("not 88", 44)

    Then -> expect(@result).to.deep.eq
      calls: [
        {context: this, args: [88]},
        {context: this, args: ["not 88", 44]}
      ]
      callCount: 2
      description: """
      This test double has 1 stubbings and 2 invocations.

      Stubbings:
        - when called with `(88)`, then return `5`.

      Invocations:
        - called with `(88)`
        - called with `("not 88", 44)`

      """
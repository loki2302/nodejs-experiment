describe('tbBuildUrl', function() {
  beforeEach(module('tbBuildUrl'));

  var buildUrl;
  beforeEach(inject(function(_buildUrl_) {
    buildUrl = _buildUrl_;
  }));

  it('should let me build a URL without any variables', function() {
    var url = buildUrl('http://example.com/', 'something');
    expect(url).toBe('http://example.com/something');
  });

  it('should let me build a URL with a single numeric variable', function() {
    var url = buildUrl('http://example.com/', '{id}', { id: 123 });
    expect(url).toBe('http://example.com/123');
  });

  it('should let me build a URL with a single string variable', function() {
    var variables = { category: 'bells and whistles' }
    var url = buildUrl('http://example.com/', '{category}', variables);
    expect(url).toBe('http://example.com/bells%20and%20whistles');
  })

  it('should let me build a URL with multiple variables', function() {
    var variables = { id1: 123, id2: 222 };
    var url = buildUrl('http://example.com/', '{id1}/{id2}', variables);
    expect(url).toBe('http://example.com/123/222');
  });

  it('should let me build a URL with static segments and variables', function() {
    var variables = { categoryId: 111, postId: 222 }
    var resource = 'categories/{categoryId}/posts/{postId}';
    var url = buildUrl('http://example.com/', resource, variables);
    expect(url).toBe('http://example.com/categories/111/posts/222');
  });
});

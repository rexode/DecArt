contract SmartContract is ERC721, Ownable {
  using Counters for Counters.Counter;
  using Strings for uint256;
  Counters.Counter _tokenIds;
  mapping(uint256 => string) _tokenURIs;
  mapping(uint256 => bool) _exists;

  struct RenderToken {
    uint256 id;
    string uri;
  }

  constructor() Ownable(msg.sender) ERC721("DECart", "DART") {}

  function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
    _tokenURIs[tokenId] = _tokenURI;
  }

  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override
    returns (string memory)
  {
    string memory _tokenURI = _tokenURIs[tokenId];
    return _tokenURI;
  }

  function mint(address recipient, string memory uri) public returns (uint256) {
    uint256 newId = _tokenIds.current();
    _mint(recipient, newId);
    _setTokenURI(newId, uri);
    _tokenIds.increment();
    return newId;
  }
}
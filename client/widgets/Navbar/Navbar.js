import styled from 'styled-components/native';
import IconEvil from "react-native-vector-icons/EvilIcons";

const NavbarContainer = styled.View`
  height: fit-content;
  width: 100%;
  display: flex;
  align-items: center;
  align-content: center;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 15px 10px 10px 10px;
  gap: 16px;
`;

const SearchContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.45);
  border-radius: 10px;
  padding: 0 12px;
`;

const Search = styled.TextInput`
  flex: 1;
  height: 42px;
  color: rgba(255, 255, 255, 0.7);
`;

const NavbarButton = styled.Text`
  color: #fff;
  font-size: 16px;
  padding: 6px;
`;

const TabName = styled.Text`
  font-size: 17px;
  font-weight: bold;
  color: #fff;
`;

const Navbar = ({ screenName, leftButton, rightButton, isSearchBar }) => {
    return (
        <NavbarContainer>
            <NavbarButton>
                {leftButton}
            </NavbarButton>
            <TabName>{screenName}</TabName>
            <NavbarButton>
                {rightButton}
            </NavbarButton>

            {isSearchBar && (
                <SearchContainer>
                    <IconEvil name="search" size={22} color="rgba(255,255,255,0.7)" />
                    <Search placeholder="Search for chats" placeholderTextColor="rgba(255,255,255,0.7)" />
                </SearchContainer>
            )}
        </NavbarContainer>
    );
};

export default Navbar;
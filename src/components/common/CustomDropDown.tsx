// import React from 'react';
// // import Dropdown from 'react-bootstrap/Dropdown';

// const CustomDropdownToggle = React.forwardRef((props: any, ref: any) => {
//   const { className, children, onClick } = props;

//   return (
//     <div
//       className={className}
//       ref={ref}
//       onClick={e => {
//         e.preventDefault();
//         onClick(e);
//       }}>
//       {children}
//     </div>
//   );
// });

// const CustomDropdownMenuItem = React.forwardRef((props: any, ref: any) => {
//   const { children, className, onClick } = props;

//   return (
//     <div ref={ref} className={className} onClick={onClick}>
//       {children}
//     </div>
//   );
// });

// // for export
// const CustomDropdown = (props: any) => <Dropdown>{props.children}</Dropdown>;

// const Toggle = (props: any) => {
//   const { children, id } = props;
//   return (
//     <Dropdown.Toggle as={CustomDropdownToggle} className="no-after cursor-pointer" id={id}>
//       {children}
//     </Dropdown.Toggle>
//   );
// };

// const Menu = (props: any) => {
//   const { children } = props;
//   return (
//     <Dropdown.Menu as={CustomDropdownMenu} className="customdropdown text-14 text-highEmphasis">
//       {children}
//     </Dropdown.Menu>
//   );
// };

// const Item = (props: any) => {
//   const { children, eventKey, onClick } = props;
//   return (
//     <Dropdown.Item as={CustomDropdownMenuItem} className="item flex" eventKey={eventKey} onClick={onClick}>
//       {children}
//     </Dropdown.Item>
//   );
// };

// export default { Dropdown: CustomDropdown, Toggle, Menu, Item };
